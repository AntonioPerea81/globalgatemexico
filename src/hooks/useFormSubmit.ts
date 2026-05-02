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

  const uploadFile = async (leadId: string, file: File, fieldName: string, index = 0) => {
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
  };

  const submit = async (step1: Step1Data, step2: FormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Generate UUID client-side — avoids needing anon SELECT on shipment_leads
      const leadId = crypto.randomUUID();

      // 2. Insert lead record (INSERT only — no .select() needed)
      const { error: leadError } = await supabase
        .from('shipment_leads')
        .insert({
          id: leadId,
          name: step1.name,
          company: step1.company,
          email: step1.email,
          phone: step1.phone,
          merchandise: step1.merchandise,
          origin: step2.get('origin') as string,
          destination: step2.get('destination') as string,
          transport_mode: step2.get('transport') as string,
          weight_dims: step2.get('dims') as string,
          quantity_detail: step2.get('quantity') as string,
          instruction_support: step2.get('instruction_support') === 'on',
          emergency_name: step2.get('emergency_name') as string,
          emergency_phone: step2.get('emergency_phone') as string,
        });

      if (leadError) throw new Error(`Lead insert failed: ${leadError.message}`);

      // 3. Upload files (SDS, photos, instruction letter)
      const sdsFile = step2.get('sds') as File | null;
      if (sdsFile && sdsFile.size > 0) {
        await uploadFile(leadId, sdsFile, 'sds');
      }

      const photoFiles = step2.getAll('photos') as File[];
      for (let i = 0; i < photoFiles.length; i++) {
        if (photoFiles[i].size > 0) await uploadFile(leadId, photoFiles[i], 'photo', i);
      }

      const instrFile = step2.get('instruction_file') as File | null;
      if (instrFile && instrFile.size > 0) {
        await uploadFile(leadId, instrFile, 'instruction_file');
      }

      // 4. Trigger Edge Function for email notification (fire-and-forget; don't block on failure)
      supabase.functions
        .invoke('notify-lead', {
          body: {
            leadId,
            name: step1.name,
            company: step1.company,
            email: step1.email,
            phone: step1.phone,
            merchandise: step1.merchandise,
          },
        })
        .catch((err) => console.warn('[notify-lead] Edge function error:', err));

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
