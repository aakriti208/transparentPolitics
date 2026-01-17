import React, { useState, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import MapView from './components/MapView';
import ContactUs from './components/ContactUs';
import CandidatesSection from './components/CandidatesSection';
import CandidateModal from './components/CandidateModal';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'contact'>('map');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const candidatesSectionRef = useRef<HTMLDivElement>(null);

  const handleDistrictClick = (districtId: string) => {
    setSelectedDistrictId(districtId);

    // Scroll to candidates section
    setTimeout(() => {
      candidatesSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleTabChange = (tab: 'map' | 'contact') => {
    setActiveTab(tab);
    setSelectedDistrictId(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen w-screen flex flex-col">
        {/* Header */}
        <Header activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Main Content */}
        {activeTab === 'map' ? (
          <>
            {/* Map Section */}
            <div className="w-full h-[70vh]">
              <MapView onDistrictClick={handleDistrictClick} />
            </div>

            {/* Candidates Section */}
            <div ref={candidatesSectionRef}>
              <CandidatesSection
                districtId={selectedDistrictId}
                onCandidateClick={setSelectedCandidateId}
              />
            </div>
          </>
        ) : (
          <ContactUs />
        )}
      </div>

      {/* Candidate Modal - At app level to overlay everything */}
      <CandidateModal
        candidateId={selectedCandidateId}
        onClose={() => setSelectedCandidateId(null)}
      />
    </QueryClientProvider>
  );
}

export default App;
