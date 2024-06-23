import PropTypes from "prop-types";
import { IoCheckmarkCircle } from "react-icons/io5";

import { DangerIcon } from "./Icons";
import { cn } from "../utils";

export const Indicator = ({ icon, indicator, title, status }) => {
  return (
    <div className="relative bg-pale-purple rounded-lg w-[91px] h-[71px] flex items-center justify-center p-1">
      <div
        className={cn(
          "absolute top-1 right-1 size-4 rounded-full bg-soft-purple flex items-center justify-center",
          status === null
            ? "bg-soft-purple"
            : status
            ? "bg-soft-purple"
            : "bg-red-500"
        )}
      >
        {status === null ? null : indicator}
      </div>

      <div className="flex flex-col items-center">
        <div
          className={cn(
            "size-[35px] flex items-center justify-center rounded-full",
            status === null
              ? "bg-medium-purple"
              : status
              ? "bg-soft-purple"
              : "bg-red-200"
          )}
        >
          {status === null ? (
            icon
          ) : status ? (
            <IoCheckmarkCircle
              className="bg-white rounded-full"
              fill="#755AE2"
              size={27.5}
            />
          ) : (
            <DangerIcon />
          )}
        </div>
        <p className="text-deep-grey text-[10px] mt-1 text-center">{title}</p>
      </div>
    </div>
  );
};

Indicator.propTypes = {
  icon: PropTypes.element.isRequired,
  indicator: PropTypes.node,
  title: PropTypes.string.isRequired,
  status: PropTypes.bool,
};
