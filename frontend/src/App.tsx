import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MapView from './components/MapView';
import DistrictDrawer from './components/DistrictDrawer';
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
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  const handleDistrictClick = (districtId: string) => {
    setSelectedDistrictId(districtId);
  };

  const handleCandidateClick = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
  };

  const handleCloseDrawer = () => {
    setSelectedDistrictId(null);
  };

  const handleCloseModal = () => {
    setSelectedCandidateId(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen w-screen overflow-hidden">
        <MapView onDistrictClick={handleDistrictClick} />

        <DistrictDrawer
          districtId={selectedDistrictId}
          onClose={handleCloseDrawer}
          onCandidateClick={handleCandidateClick}
        />

        <CandidateModal
          candidateId={selectedCandidateId}
          onClose={handleCloseModal}
        />
      </div>
    </QueryClientProvider>
  );
}

export default App;
