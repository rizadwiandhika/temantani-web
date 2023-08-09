import { useState, useCallback, useMemo } from "react";

export function useDisableButton(
  enabledText = "",
  disabledText = enabledText,
  isDisableStatus = false,
) {
  const [enabledTextState, setEnabledTextState] = useState(enabledText);
  const [disabledTextState, setDisabledTextState] = useState(disabledText);
  const [disableStatus, setDisableStatus] = useState(isDisableStatus);
  const [text, setText] = useState(
    isDisableStatus ? disabledText : enabledText,
  );

  const disable = useCallback(() => {
    setText(disabledTextState);
    setDisableStatus(true);
  }, [disabledTextState]);

  const disableWithoutChangeText = useCallback(() => {
    setDisableStatus(true);
  }, []);

  const update = useCallback(
    ({ enableText = "", disabledText = "", disabled = false }) => {
      setEnabledTextState(enableText);
      setDisabledTextState(disabledText);
      setDisableStatus(disabled);
      setText(disabled ? disabledText : enableText);
    },
    [],
  );

  const enable = useCallback(() => {
    setText(enabledTextState);
    setDisableStatus(false);
  }, [enabledTextState]);

  const button = useMemo(
    () => ({
      text: "",
      status: false,
      disable: () => {},
      enable: () => {},
      disableWithoutChangeText: () => {},
      update: ({ enableText = "", disabledText = "", disabled = false }) => {},
    }),
    [],
  );

  button.text = text;
  button.status = disableStatus;
  button.disable = disable;
  button.enable = enable;
  button.disableWithoutChangeText = disableWithoutChangeText;
  button.update = update;

  return button;
}
