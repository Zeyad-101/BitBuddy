import { Routes, Route, Navigate } from 'react-router-dom';
import { PetProvider } from './features/pet/state/PetProvider';
import { LandingRoute } from './routes/LandingRoute';
import { PetSelectRoute } from './routes/PetSelectRoute';
import { PetNameRoute } from './routes/PetNameRoute';
import { PetRoomRoute } from './routes/PetRoomRoute';

export default function App() {
  return (
    <PetProvider>
      <Routes>
        <Route path="/" element={<LandingRoute />} />
        <Route path="/select" element={<PetSelectRoute />} />
        <Route path="/name" element={<PetNameRoute />} />
        <Route path="/room" element={<PetRoomRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PetProvider>
  );
}
