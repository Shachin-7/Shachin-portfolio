import { 
  SiPython, 
  SiPytorch, 
  SiTensorflow, 
  SiScikitlearn, 
  SiPandas, 
  SiNumpy, 
  SiFastapi, 
  SiDocker, 
  SiJupyter, 
  SiHuggingface, 
  SiStreamlit 
} from "react-icons/si";

export const techLogos = [
  {
    node: (
      <div className="flex items-center gap-2.5 bg-bg-800/80 border border-bg-700/40 px-4 py-2 rounded-full select-none">
        <span className="text-lg text-[#3776AB]"><SiPython /></span>
        <span className="text-xs font-semibold text-text-primary tracking-wide">Python</span>
      </div>
    ),
    href: "https://www.python.org"
  },
  {
    node: (
      <div className="flex items-center gap-2.5 bg-bg-800/80 border border-bg-700/40 px-4 py-2 rounded-full select-none">
        <span className="text-lg text-[#EE4C2C]"><SiPytorch /></span>
        <span className="text-xs font-semibold text-text-primary tracking-wide">PyTorch</span>
      </div>
    ),
    href: "https://pytorch.org"
  },
  {
    node: (
      <div className="flex items-center gap-2.5 bg-bg-800/80 border border-bg-700/40 px-4 py-2 rounded-full select-none">
        <span className="text-lg text-[#FF6F00]"><SiTensorflow /></span>
        <span className="text-xs font-semibold text-text-primary tracking-wide">TensorFlow</span>
      </div>
    ),
    href: "https://www.tensorflow.org"
  },
  {
    node: (
      <div className="flex items-center gap-2.5 bg-bg-800/80 border border-bg-700/40 px-4 py-2 rounded-full select-none">
        <span className="text-lg text-[#FFD21E]"><SiHuggingface /></span>
        <span className="text-xs font-semibold text-text-primary tracking-wide">Hugging Face</span>
      </div>
    ),
    href: "https://huggingface.co"
  },
  {
    node: (
      <div className="flex items-center gap-2.5 bg-bg-800/80 border border-bg-700/40 px-4 py-2 rounded-full select-none">
        <span className="text-lg text-[#F7931E]"><SiScikitlearn /></span>
        <span className="text-xs font-semibold text-text-primary tracking-wide">scikit-learn</span>
      </div>
    ),
    href: "https://scikit-learn.org"
  },
  {
    node: (
      <div className="flex items-center gap-2.5 bg-bg-800/80 border border-bg-700/40 px-4 py-2 rounded-full select-none">
        <span className="text-lg text-[#150458]"><SiPandas /></span>
        <span className="text-xs font-semibold text-text-primary tracking-wide">pandas</span>
      </div>
    ),
    href: "https://pandas.pydata.org"
  },
  {
    node: (
      <div className="flex items-center gap-2.5 bg-bg-800/80 border border-bg-700/40 px-4 py-2 rounded-full select-none">
        <span className="text-lg text-[#013243]"><SiNumpy /></span>
        <span className="text-xs font-semibold text-text-primary tracking-wide">NumPy</span>
      </div>
    ),
    href: "https://numpy.org"
  },
  {
    node: (
      <div className="flex items-center gap-2.5 bg-bg-800/80 border border-bg-700/40 px-4 py-2 rounded-full select-none">
        <span className="text-lg text-[#009688]"><SiFastapi /></span>
        <span className="text-xs font-semibold text-text-primary tracking-wide">FastAPI</span>
      </div>
    ),
    href: "https://fastapi.tiangolo.com"
  },
  {
    node: (
      <div className="flex items-center gap-2.5 bg-bg-800/80 border border-bg-700/40 px-4 py-2 rounded-full select-none">
        <span className="text-lg text-[#FF4B4B]"><SiStreamlit /></span>
        <span className="text-xs font-semibold text-text-primary tracking-wide">Streamlit</span>
      </div>
    ),
    href: "https://streamlit.io"
  },
  {
    node: (
      <div className="flex items-center gap-2.5 bg-bg-800/80 border border-bg-700/40 px-4 py-2 rounded-full select-none">
        <span className="text-lg text-[#2496ED]"><SiDocker /></span>
        <span className="text-xs font-semibold text-text-primary tracking-wide">Docker</span>
      </div>
    ),
    href: "https://www.docker.com"
  },
  {
    node: (
      <div className="flex items-center gap-2.5 bg-bg-800/80 border border-bg-700/40 px-4 py-2 rounded-full select-none">
        <span className="text-lg text-[#F37626]"><SiJupyter /></span>
        <span className="text-xs font-semibold text-text-primary tracking-wide">Jupyter</span>
      </div>
    ),
    href: "https://jupyter.org"
  }
];
