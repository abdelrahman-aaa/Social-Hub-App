// Third-party Library Imports
import { BounceLoader } from "react-spinners";

/**
 * Loading Page Component
 *
 * Displays a full-screen loading spinner overlay.
 * Typically used as a fallback during lazy-loaded routes or data fetching states.
 */
export default function Loading() {
  return (
    <>
      {/* Full-screen fixed overlay with centered spinner */}
      <div className="fixed top-0 left-0 z-50 right-0 bottom-0 flex items-center justify-center">
        <BounceLoader color="#57c4ee" size={70} />
      </div>
    </>
  );
}
