import * as cocoSSD from "@tensorflow-models/coco-ssd";
import * as blazeFace from "@tensorflow-models/blazeface";
import { useCallback, useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs";

import { Indicator } from "./Indicator";
import { LampIcon, WebcamIcon, WifiIcon } from "./Icons";
import { Modal } from "./Modal";

export const MainComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [model, setModel] = useState(null);
  const [faceModel, setFaceModel] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);

  const [webcamStatus, setWebcamStatus] = useState(null);
  const [micStatus, setMicStatus] = useState(null);
  const [lightingStatus, setLightingStatus] = useState(null);
  const [wifiSpeedStatus, setWifiSpeedStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Load the COCO-SSD model
    const loadModels = async () => {
      try {
        const loadedModel = await cocoSSD.load();
        setModel(loadedModel);
        console.log("COCO-SSD model loaded successfully");

        const loadedFaceModel = await blazeFace.load();
        setFaceModel(loadedFaceModel);
        console.log("BlazeFace model loaded successfully");
      } catch (error) {
        setError("Error loading the models");
        console.error({ error });
      }
    };
    loadModels();

    // Access the webcam
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setWebcamStatus(true);
          // Trigger the lighting check after a short delay
          setTimeout(checkLighting, 2000);
        }
      })
      .catch((err) => {
        setWebcamStatus(false);
        setError("Error accessing webcam");
        console.error("Error accessing webcam", err);
      });

    // Check for microphone access
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop());
        setMicStatus(true);
      })
      .catch((err) => {
        setMicStatus(false);
        setError("Error accessing microphone");
        console.error("Error accessing microphone", err);
      });
  }, []);

  const detectFrame = useCallback(async () => {
    if (model && faceModel && videoRef.current?.readyState === 4) {
      const predictions = await model.detect(videoRef.current);
      const facePredictions = await faceModel.estimateFaces(
        videoRef.current,
        false
      );

      const ctx = canvasRef.current?.getContext("2d");
      if (ctx && canvasRef.current && videoRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        predictions.forEach((prediction) => {
          ctx.beginPath();
          ctx.rect(...prediction.bbox);
          ctx.lineWidth = 2;
          ctx.strokeStyle = "red";
          ctx.fillStyle = "red";
          ctx.stroke();
          ctx.fillText(
            `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
            prediction.bbox[0],
            prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
          );
        });

        facePredictions.forEach((face) => {
          const [topLeftX, topLeftY] = face.topLeft;
          const [bottomRightX, bottomRightY] = face.bottomRight;

          const boundingBoxWidth = bottomRightX - topLeftX;
          const boundingBoxHeight = bottomRightY - topLeftY;

          // Define regions for each feature
          const regions = {
            forehead: {
              x: topLeftX + boundingBoxWidth * 0.25,
              y: topLeftY,
              width: boundingBoxWidth * 0.5,
              height: boundingBoxHeight * 0.2,
            },
            eyes: {
              x: topLeftX + boundingBoxWidth * 0.2,
              y: topLeftY + boundingBoxHeight * 0.2,
              width: boundingBoxWidth * 0.6,
              height: boundingBoxHeight * 0.2,
            },
            nose: {
              x: topLeftX + boundingBoxWidth * 0.35,
              y: topLeftY + boundingBoxHeight * 0.4,
              width: boundingBoxWidth * 0.3,
              height: boundingBoxHeight * 0.2,
            },
            lips: {
              x: topLeftX + boundingBoxWidth * 0.3,
              y: topLeftY + boundingBoxHeight * 0.6,
              width: boundingBoxWidth * 0.4,
              height: boundingBoxHeight * 0.2,
            },
            ears: {
              x: topLeftX,
              y: topLeftY + boundingBoxHeight * 0.2,
              width: boundingBoxWidth,
              height: boundingBoxHeight * 0.6,
            },
          };

          const isFeatureInRegion = (landmark, region) => {
            const [x, y] = landmark;
            return (
              x >= region.x &&
              x <= region.x + region.width &&
              y >= region.y &&
              y <= region.y + region.height
            );
          };

          const featuresDetected = [
            isFeatureInRegion(face.landmarks[0], regions.forehead),
            isFeatureInRegion(face.landmarks[1], regions.eyes),
            isFeatureInRegion(face.landmarks[2], regions.eyes),
            isFeatureInRegion(face.landmarks[3], regions.nose),
            isFeatureInRegion(face.landmarks[4], regions.lips),
          ];

          if (featuresDetected?.some(Boolean)) {
            setError(null);
          } else {
            setError("Please ensure your entire face is clearly visible");
          }

          ctx.beginPath();
          ctx.rect(
            topLeftX,
            topLeftY,
            bottomRightX - topLeftX,
            bottomRightY - topLeftY
          );
          ctx.lineWidth = 2;
          ctx.strokeStyle = "green";
          // ctx.fillStyle = "blue";
          ctx.stroke();

          // Draw facial keypoints
          if (Array.isArray(face.landmarks)) {
            face.landmarks.forEach(([x, y]) => {
              ctx.fillStyle = "blue";
              ctx.fillRect(x - 2, y - 2, 4, 4);
            });
          }
        });
      }
    }

    requestAnimationFrame(detectFrame);
  }, [faceModel, model]);

  useEffect(() => {
    if (model && faceModel) {
      detectFrame();
    }
  }, [detectFrame, faceModel, model]);

  const startRecording = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const options = { mimeType: "video/webm; codecs=vp9" };
      const mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          setRecordedChunks((prev) => [...prev, e.data]);
        }
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(videoBlob);
        setVideoUrl(url);
      };

      mediaRecorder.start();
      setRecording(true);

      setTimeout(() => {
        mediaRecorder.stop();
        setRecording(false);
        setShowModal(true);
      }, 5000);
    }
  };

  const handleVideoEnded = () => {
    setVideoUrl(null);
    setRecordedChunks([]);
  };

  const checkLighting = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");

      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const data = imageData.data;

        let r, g, b, avg;
        let colorSum = 0;

        for (let x = 0, len = data.length; x < len; x += 4) {
          r = data[x];
          g = data[x + 1];
          b = data[x + 2];

          avg = Math.floor((r + g + b) / 3);
          colorSum += avg;
        }

        const brightness = Math.floor(
          colorSum / (canvas.width * canvas.height)
        );

        if (brightness > 80) {
          setLightingStatus(true);
        } else {
          setError("Move to a brighter environment");
          setLightingStatus(false);
        }
      }
    }
  };

  return (
    <>
      <section className="w-full max-w-[832px] mx-auto bg-white mt-6 rounded-[20px] p-8 pr-12">
        <h3 className="font-medium text-xl">System check</h3>
        <p className="text-deep-grey text-sm mt-3">
          We utilize your camera image to ensure fairness for all participants,
          and we also employ both your camera and microphone for a video
          questions where you will be prompted to record a response using your
          camera or webcam, so it&apos;s essential to verify that your camera and
          microphone are functioning correctly and that you have a stable
          internet connection. To do this, please position yourself in front of
          your camera, ensuring that your entire face is clearly visible on the
          screen. This includes your forehead, eyes, ears, nose, and lips. You
          can initiate a 5-second recording of yourself by clicking the button
          below.
        </p>

        <div className="my-8 flex flex-col sm:flex-row items-center gap-6">
          {/* Video container */}
          <div className="w-full relative max-w-[275px] h-[168px] border border-soft-purple rounded-[10px]">
            <video
              ref={videoRef}
              autoPlay
              className="w-full h-full absolute rounded-[10px] inset-0"
            />
            <canvas
              ref={canvasRef}
              className="absolute rounded-[10px] inset-0 w-full h-full"
            />
          </div>

          {/* Indicators */}
          <div className="grid grid-cols-2 gap-4">
            <Indicator
              icon={<WebcamIcon />}
              indicator={<WebcamIcon size="8" stroke="white" />}
              title="Webcam"
              status={webcamStatus}
            />
            <Indicator
              icon={<WifiIcon />}
              indicator={<WifiIcon size="8" stroke="white" />}
              title="Speed"
              status={wifiSpeedStatus}
            />
            <Indicator
              icon={<WebcamIcon />}
              indicator={<WebcamIcon size="8" stroke="white" />}
              title="Gadget mic"
              status={micStatus}
            />
            <Indicator
              icon={<LampIcon />}
              indicator={<LampIcon size="8" stroke="white" />}
              title="Lighting"
              status={lightingStatus}
            />
          </div>
        </div>

        {/* Button to trigger the detection */}
        <button
          className="bg-soft-purple block mx-auto sm:mx-0 rounded-lg h-[44px] text-sm text-white px-6 cursor-pointer"
          onClick={startRecording}
          disabled={recording}
        >
          {recording ? "Recording..." : "Take a picture and continue"}
        </button>

        {/* Error message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </section>

      {showModal && (
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          videoUrl={videoUrl}
          handleVideoEnded={handleVideoEnded}
        />
      )}
    </>
  );
};
