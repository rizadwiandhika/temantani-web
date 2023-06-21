import React, { useState, useCallback, useEffect } from "react";
import {
  Navbar,
  Banner,
  SectionContent,
  Form,
  PictureName,
} from "../../components";
import { useBanner, useDisableButton, useFetch } from "../../hooks";
import { classNames, token } from "../../util";
import { userAPI } from "../../api";

export function ProfilePage() {
  const banner = useBanner();
  const updateProfileButton = useDisableButton("Update profile", "Updating...");
  const profileReq = useFetch();
  const updateProfileReq = useFetch();

  const [profile, setProfile] = useState({ id: "", name: "", phone: "" });
  const [bank, setBank] = useState({ bank: "", number: "", holder: "" });
  const [address, setAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    const jwt = token.get();
    profileReq.trigger(() => userAPI.me(jwt));
  }, [profileReq]);

  useEffect(() => {
    if (profileReq.loading) {
      return;
    }

    if (profileReq.error.happened) {
      banner.show(profileReq.error.message);
      return;
    }

    if (profileReq.success) {
      const {
        id,
        name,
        phoneNumber,
        address,
        bankAccount: bank,
      } = profileReq.data;
      setProfile({ id, name, phone: phoneNumber });
      setAddress(address);
      if (bank) {
        setBank({
          bank: bank.bank,
          number: bank.accountNumber,
          holder: bank.accountHolderName,
        });
      }
    }
  }, [
    banner,
    profileReq.loading,
    profileReq.error.happened,
    profileReq.error.message,
    profileReq.success,
    profileReq.data,
  ]);

  useEffect(() => {
    if (updateProfileReq.loading) {
      updateProfileButton.disable();
      return;
    }
    updateProfileButton.enable();

    if (updateProfileReq.error.happened) {
      banner.show(updateProfileReq.error.message);
      return;
    }

    if (updateProfileReq.success) {
      banner.show("Profile updated successfully");
    }
  }, [
    banner,
    updateProfileButton,
    updateProfileReq.error.happened,
    updateProfileReq.error.message,
    updateProfileReq.loading,
    updateProfileReq.success,
  ]);

  const updateProfile = () => {
    const payload = {
      name: profile.name,
      phoneNumber: profile.phone,
      address,
      bankAccount: {
        bank: bank.bank,
        accountNumber: bank.number,
        accountHolderName: bank.holder,
      },
    };

    updateProfileReq.trigger(() =>
      userAPI.updateProfile(token.get(), token.getUserId(), payload),
    );
  };

  const updateField = useCallback(
    (key = "", value = "", setter = (prev) => {}) => {
      setter((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

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
        <div className="flex justify-end">
          <button
            className={classNames(
              "flex w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
              updateProfileButton.status && "opacity-50 cursor-not-allowed",
            )}
            disabled={updateProfileButton.status}
            onClick={updateProfile}
          >
            {updateProfileButton.text}
          </button>
        </div>

        <SectionContent title="Profile">
          <Form.InputLabel
            label="Name"
            value={profile.name}
            onChange={(e) => updateField("name", e.target.value, setProfile)}
            type="text"
          />
          <Form.InputLabel
            label="Phone Number"
            value={profile.phone}
            onChange={(e) => updateField("phone", e.target.value, setProfile)}
            type="text"
          />
        </SectionContent>
        <SectionContent title="Address">
          <Form.InputLabel
            label="Street"
            value={address.street}
            onChange={(e) => updateField("street", e.target.value, setAddress)}
            type="text"
          />
          <Form.InputLabel
            label="City"
            value={address.city}
            onChange={(e) => updateField("city", e.target.value, setAddress)}
            type="text"
          />
          <Form.InputLabel
            label="Postal Code"
            value={address.postalCode}
            onChange={(e) =>
              updateField("postalCode", e.target.value, setAddress)
            }
            type="text"
          />
        </SectionContent>
        <SectionContent title="Bank Account">
          <Form.InputLabel
            label="Bank"
            placeholder="Bank"
            value={bank.bank}
            onChange={(e) => updateField("bank", e.target.value, setBank)}
            type="text"
          />
          <Form.InputLabel
            label="Account number"
            placeholder="Account number"
            value={bank.number}
            onChange={(e) => updateField("number", e.target.value, setBank)}
            type="text"
          />
          <Form.InputLabel
            label="Account holder name"
            placeholder="Account holder name"
            value={bank.holder}
            onChange={(e) => updateField("holder", e.target.value, setBank)}
            type="text"
          />
        </SectionContent>
      </main>
    </>
  );
}
