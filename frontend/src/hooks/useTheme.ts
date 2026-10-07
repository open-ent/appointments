import { odeServices } from "@open-ent/client";
import { useEffect, useState } from "react";

import { APPOINTMENTS } from "~/core/constants";

export const useTheme = () => {
  const [isTheme1D, setIsTheme1D] = useState(false);

  useEffect(() => {
    const getIsTheme1D = async (): Promise<void> => {
      // Passer le CODE applicatif (pas une chaîne vide) : getConf propage `app`
      // dans appConfReady ; "" générait des appels /conf/public à app vide
      // (`//conf/public` -> bloqué par la CSP). theme.is1d reste global.
      const res = (await odeServices.conf().getConf(APPOINTMENTS)).theme.is1d;
      setIsTheme1D(res);
    };

    void getIsTheme1D();
  }, []);

  return { isTheme1D };
};
