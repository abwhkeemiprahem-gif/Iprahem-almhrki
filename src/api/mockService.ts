import { ContactFormInput, ApiResponse } from './contracts';
import { useAppStore, Message } from '../store/appStore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export function submitContact(data: ContactFormInput): Promise<ApiResponse<{ id: string; date: string }>> {
  return new Promise(async (resolve) => {
    const id = 'msg-' + Date.now();
    const dateStr = new Date().toLocaleDateString();

    const messageObj: Message = {
      id,
      name: data.name,
      email: data.email,
      service: data.service,
      budget: data.budget,
      message: data.message,
      technicalAudit: data.technicalAudit,
      date: dateStr,
    };

    try {
      // Direct, production-ready storage in Firestore
      const docRef = doc(db, 'technical_audits', id);
      await setDoc(docRef, {
        id,
        name: data.name,
        email: data.email,
        service: data.service,
        budget: data.budget,
        message: data.message,
        requestedAudit: data.technicalAudit,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      console.log('Successfully saved audit submission to production Firestore:', id);

      // 4. Non-blocking EmailJS direct dispatch integration
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        try {
          const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              service_id: serviceId,
              template_id: templateId,
              user_id: publicKey,
              template_params: {
                from_name: data.name,
                from_email: data.email,
                service_title: data.service,
                budget_range: data.budget,
                message: data.message,
                requested_audit: data.technicalAudit ? 'YES' : 'NO',
                reply_to: data.email,
                submission_id: id,
                timestamp: new Date().toLocaleString()
              },
            }),
          });

          if (emailResponse.ok) {
            console.log('[EmailJS] Inquiry email successfully dispatched to consultant.');
          } else {
            const errText = await emailResponse.text();
            console.warn('[EmailJS] Delivery warning returned by service:', errText);
          }
        } catch (emailErr) {
          console.error('[EmailJS] System connection failure:', emailErr);
        }
      } else {
        console.log('[EmailJS] Environment credentials not detected. Stored securely in Firestore database only.');
      }

      // Save to local Zustand store to immediately show on screen
      useAppStore.getState().addMessage(messageObj);

      resolve({
        success: true,
        data: {
          id,
          date: dateStr,
        },
      });
    } catch (error) {
      console.error('Firestore submission error:', error);
      try {
        // Handle using standard error framework
        handleFirestoreError(error, OperationType.CREATE, `technical_audits/${id}`);
      } catch (processedError) {
        resolve({
          success: false,
          error: processedError instanceof Error ? processedError.message : 'Permission denied or connection failure',
        });
      }
    }
  });
}
