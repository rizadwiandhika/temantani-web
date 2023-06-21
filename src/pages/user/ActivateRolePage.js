import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  Navbar,
  Banner,
  PictureName,
  SectionContent,
  Form,
} from "../../components";
import { useBanner, useDisableButton, useFetch } from "../../hooks";
import { getValueThen, classNames, token } from "../../util";
import { userAPI } from "../../api";

const ROLE_OPTIONS = [
  { value: "INVESTOR", display: "INVESTOR" },
  { value: "WORKER", display: "WORKER" },
  { value: "LANDOWNER", display: "LAND OWNER" },
];

export function ActivateRolePage() {
  const banner = useBanner();
  const button = useDisableButton("Activate role", "Activating...");
  const meFetch = useFetch();
  const activateRoleFetch = useFetch();

  const [role, setRole] = useState("INVESTOR");
  const [idCardExists, setIdCardExists] = useState(false);
  const [idCardNumber, setIdCardNumber] = useState("");
  const [idCardFile, setIdCardFile] = useState(null);

  const activateRole = () => {
    const jwt = token.get();
    const userId = meFetch.data.id;
    activateRoleFetch.trigger(() =>
      userAPI.activateRole(jwt, userId, {
        role: role,
        identityCardNumber: idCardNumber,
        address: meFetch.data.address,
        identityCard: idCardFile,
        bank: {
          name: meFetch.data.bankAccount?.bank,
          accountNumber: meFetch.data.bankAccount?.accountNumber,
          accountHolderName: meFetch.data.bankAccount?.accountHolderName,
        },
      }),
    );
  };

  useEffect(() => {
    if (meFetch.loading) {
      return;
    }

    if (meFetch.error.happened) {
      banner.show(meFetch.error.message);
      return;
    }

    if (meFetch.success) {
      const { identityCardNumber = "" } = meFetch.data;
      if (identityCardNumber) {
        setIdCardExists(true);
        setIdCardNumber(identityCardNumber);
      }
    }
  }, [
    meFetch.loading,
    meFetch.error.happened,
    meFetch.error.message,
    meFetch.success,
    meFetch.data,
    banner,
  ]);

  useEffect(() => {
    meFetch.trigger(() => userAPI.me(token.get()));
  }, [meFetch]);

  useEffect(() => {
    if (activateRoleFetch.loading) {
      button.disable();
      return;
    }
    button.enable();

    if (activateRoleFetch.error.happened) {
      banner.show(activateRoleFetch.error.message);
      return;
    }

    if (activateRoleFetch.success) {
      banner.show("Role activated successfully");
    }
  }, [
    activateRoleFetch.error.happened,
    activateRoleFetch.error.message,
    activateRoleFetch.loading,
    activateRoleFetch.success,
    banner,
    button,
  ]);

  return (
    <>
      <Navbar />
      <Banner
        visible={banner.visibility}
        message={banner.message}
        onCloseClicked={banner.hide}
      />
      <main className="w-11/12 max-w-lg mx-auto my-8">
        <PictureName />
        <SectionContent title="Role activation" noBold>
          <div className="flex flex-col gap-4">
            <Form.InputDropDown
              value={role}
              onChange={getValueThen(setRole)}
              options={ROLE_OPTIONS}
              label="Select role"
            />
            <Form.InputLabel
              label="ID card number"
              placeholder="Enter ID card number..."
              value={idCardNumber}
              readOnly={idCardExists}
              onChange={getValueThen(setIdCardNumber)}
            />

            <Form.InputFileButton
              label="ID card file"
              onChange={(e) => setIdCardFile(e.target.files[0])}
            />
            <button
              className={classNames(
                "flex w-full my-4 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                button.status && "opacity-50 cursor-not-allowed",
              )}
              disabled={button.status}
              onClick={activateRole}
            >
              {button.text}
            </button>
          </div>
        </SectionContent>
      </main>
    </>
  );
}
