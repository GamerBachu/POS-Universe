import { createContext } from "react";
import type { LanguageContextType } from "./type";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export default LanguageContext;