import PropTypes from "prop-types";

import { cn } from "../utils";

export const Modal = ({
  showModal,
  setShowModal,
  videoUrl,
  handleVideoEnded,
}) => {
  return (
    <>
      <div
        id="modal"
        tabIndex={-1}
        aria-hidden={showModal ? "false" : "true"}
        className={cn(
          "overflow-y-auto overflow-x-hidden fixed z-50 justify-center items-center w-full inset-0 h-full bg-black bg-opacity-50",
          showModal ? "flex" : "hidden"
        )}
        onClick={() => setShowModal(false)}
      >
        <div className="relative p-4 w-full rounded-[18px] max-w-[472px] h-[314px] flex items-center">
          {/* <!-- Modal content --> */}
          <div className="relative bg-soft-purple rounded-[18px]  shadow">
            {/* <!-- Modal header --> */}
            <div className="flex justify-between items-center mt-4 px-6 py-2">
              <h3 className="font-medium text-white">Start assessment</h3>

              <button
                type="button"
                className="text-white bg-pale-purple/20 hover:bg-pale-purple/30 transition duration-300 rounded-lg text-[12px] px-6 py-1.5 inline-flex"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>

            <div className="flex flex-col bg-pale-purple rounded-b-[18px]">
              <div className="flex flex-col items-center mt-6 px-12">
                {videoUrl ? (
                  <video
                    controls
                    src={videoUrl}
                    className="w-full h-full rounded-[10px]"
                    onEnded={handleVideoEnded}
                    onPause={handleVideoEnded}
                  />
                ) : (
                  <>
                    <h3 className="text-soft-purple font-medium text-xl">
                      Proceed to start assessment
                    </h3>
                    <p className="text-center text-sm text-medium-grey">
                      Kindly keep to the rules of the assessment and sit up,
                      stay in front of your camera/webcam and start your
                      assessment.
                    </p>
                  </>
                )}
              </div>

              <div className="flex items-center bg-white rounded-[18px] px-6 py-4 mt-28">
                <button
                  type="button"
                  className="text-white ml-auto bg-soft-purple hover:text-off-white font-medium rounded-lg px-6 py-2 text-center"
                  onClick={() => setShowModal(false)}
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Modal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  videoUrl: PropTypes.string,
  handleVideoEnded: PropTypes.func.isRequired,
};
