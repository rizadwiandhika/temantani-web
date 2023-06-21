import { useState, useCallback, useMemo } from "react";

export function useDisableButton(
  enabledText = "",
  disabledText = "",
  isDisableStatus = false,
) {
  const [disableStatus, setDisableStatus] = useState(isDisableStatus);
  const [text, setText] = useState(enabledText);

  const disable = useCallback(() => {
    setText(disabledText);
    setDisableStatus(true);
  }, [disabledText]);

  const disableWithoutChangeText = useCallback(() => {
    setDisableStatus(true);
  }, []);

  const enable = useCallback(() => {
    setText(enabledText);
    setDisableStatus(false);
  }, [enabledText]);

  return useMemo(
    () => ({
      text,
      status: disableStatus,
      disable,
      enable,
      disableWithoutChangeText,
    }),
    [disable, enable, disableStatus, text, disableWithoutChangeText],
  );
}
