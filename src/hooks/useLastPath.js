import { useLocation } from 'react-router-dom';

function useLastPathSegment() {
  const location = useLocation();
  return location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
}


export default useLastPathSegment;
