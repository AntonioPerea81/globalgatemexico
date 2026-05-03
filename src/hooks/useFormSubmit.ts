import { useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Step1Data {
  name: string;
  company: string;
  email: string;
  phone: string;
  merchandise: string;
}

interface UseFormSubmitReturn {
  isLoading: boolean;
  error: string | null;
  submit: (step1: Step1Data, step2: FormData) => Promise<boolean>;
}

export const useFormSubmit = (): UseFormSubmitReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Returns the actual storage path used so callers can pass it to the Edge Function accurately
  const uploadFile = async (leadId: string, file: File, fieldName: string, index = 0): Promise<string> => {
    const ext = file.name.split('.').pop() ?? 'bin';
    const path = `${leadId}/${fieldName}_${index}_${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('shipment-docs')
      .upload(path, file, { upsert: false, contentType: file.type });

    if (uploadError) throw new Error(`File upload failed (${fieldName}): ${uploadError.message}`);

    const { error: dbError } = await supabase.from('lead_files').insert({
      lead_id: leadId,
      field_name: fieldName,
      file_path: path,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
    });

    if (dbError) throw new Error(`File record failed (${fieldName}): ${dbError.message}`);

    return path;
  };

  const submit = async (step1: Step1Data, step2: FormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Generate UUID client-side — avoids needing anon SELECT on shipment_leads
      const leadId = crypto.randomUUID();

      // 2. Collect all step-2 scalar fields into a plain object for reuse
      const leadData = {
        origin:              step2.get('origin') as string,
        destination:         step2.get('destination') as string,
        transport_mode:      step2.get('transport') as string,
        weight_dims:         step2.get('dims') as string,
        quantity_detail:     step2.get('quantity') as string,
        instruction_support: step2.get('instruction_support') === 'on',
        emergency_name:      step2.get('emergency_name') as string,
        emergency_phone:     step2.get('emergency_phone') as string,
      };

      // 3. Insert lead record (INSERT only — no .select() needed)
      const { error: leadError } = await supabase
        .from('shipment_leads')
        .insert({
          id: leadId,
          name: step1.name,
          company: step1.company,
          email: step1.email,
          phone: step1.phone,
          merchandise: step1.merchandise,
          ...leadData,
        });

      if (leadError) throw new Error(`Lead insert failed: ${leadError.message}`);

      // 4. Upload files (SDS, photos, instruction letter) — track paths for Edge Function
      const uploadedFiles: { fieldName: string; fileName: string; path: string }[] = [];

      const sdsFile = step2.get('sds') as File | null;
      if (sdsFile && sdsFile.size > 0) {
        const sdsPath = await uploadFile(leadId, sdsFile, 'sds');
        uploadedFiles.push({ fieldName: 'sds', fileName: sdsFile.name, path: sdsPath });
      }

      const photoFiles = step2.getAll('photos') as File[];
      for (let i = 0; i < photoFiles.length; i++) {
        const photo = photoFiles[i];
        if (photo && photo.size > 0) {
          const photoPath = await uploadFile(leadId, photo, 'photo', i);
          uploadedFiles.push({ fieldName: 'photo', fileName: photo.name, path: photoPath });
        }
      }

      const instrFile = step2.get('instruction_file') as File | null;
      if (instrFile && instrFile.size > 0) {
        const instrPath = await uploadFile(leadId, instrFile, 'instruction_file');
        uploadedFiles.push({ fieldName: 'instruction_file', fileName: instrFile.name, path: instrPath });
      }

      // 5. Invoke Edge Function — awaited so we can log errors; does not block success screen
      try {
        const { error: fnError } = await supabase.functions.invoke('notify-lead', {
          body: {
            leadId,
            leadData: {
              ...step1,
              ...leadData,
            },
            uploadedFiles,
          },
        });
        if (fnError) {
          console.error('[notify-lead] Function returned error:', fnError);
        }
      } catch (fnErr) {
        console.error('[notify-lead] Invocation failed:', fnErr);
      }

      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      console.error('[useFormSubmit]', msg);
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, submit };
};
