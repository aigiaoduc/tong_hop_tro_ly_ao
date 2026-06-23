import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
}

const SITE_NAME = 'Trợ Lý Ảo Thầy Quân';

const SEO: React.FC<SEOProps> = ({ title, description }) => {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description || 'Website cá nhân - Kho ứng dụng, khóa học và phần mềm chất lượng cao.');
  }, [title, description]);

  return null;
};

export default SEO;
