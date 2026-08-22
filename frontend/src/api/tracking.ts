import api from './AxiosConfig';

export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'bot' | 'other';

export function detectDevice(): DeviceType {
  const ua = navigator.userAgent;
  
  if (/bot|googlebot|crawler|spider|curl|scraping/i.test(ua)) {
    return 'bot';
  }
  
  if (/android|iphone|ipod|mobile|blackberry|windows phone/i.test(ua)) {
    return 'mobile';
  }
  
  if (/ipad|tablet|kindle|playbook/i.test(ua)) {
    return 'tablet';
  }
  
  return 'desktop';
}

export async function trackPageView(path: string): Promise<void> {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source') || '';
    
    await api.post('/frontend/track/', {
      path: path,
      referrer: document.referrer || '',
      device_type: detectDevice(),
      source: source,
    });
  } catch (error) {
    return
  }
}