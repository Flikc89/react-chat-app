import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <div className="relative w-full h-full rounded-2xl border border-gray-700/50 overflow-hidden bg-gray-900/70 flex flex-col md:flex-row">
      {children}
    </div>
  );
};

export default PageContainer;
