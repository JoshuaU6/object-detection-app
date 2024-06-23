import { RiEyeLine } from "react-icons/ri";
import { TbClockPlay } from "react-icons/tb";

export const Navbar = () => {
  return (
    <header className="xs:h-[98px] py-3 xs:py-0 bg-white w-full flex flex-col xs:flex-row sm:items-center justify-between gap-4 px-8 sm:px-16 max-w-[1400px]">
      <Logo />
      <Timer />
    </header>
  );
};

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <img src="/logo.svg" alt="logo" className="w-[63px] h-[63px]" />
      <div>
        <h1 className="font-medium text-[20px]">Frontend developer</h1>
        <p className="text-light-grey text-sm">Skill assessment test</p>
      </div>
    </div>
  );
};

const Timer = () => {
  return (
    <div className="flex items-center gap-4 ml-auto">
      <div className="bg-light-purple rounded-lg w-[178px] h-[44px] flex items-center justify-center">
        <div className="bg-medium-purple rounded-full p-2 flex justify-center items-center">
          <TbClockPlay className="text-soft-purple size-4 font-semibold" />
        </div>

        <p className="text-soft-purple font-bold text-lg">29:10 time left</p>
      </div>

      <button className="w-[30px] h-[30px] flex items-center bg-medium-purple rounded-full justify-center">
        <RiEyeLine className="text-soft-purple size-5" />
      </button>
    </div>
  );
};
