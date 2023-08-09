import React, { useReducer, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ArticleContent, Form, Button, Banner } from "../../../components";
import { useFetch, useDisableButton, useBanner } from "../../../hooks";
import { landAPI } from "../../../api";
import { token } from "../../../util";

function reducer(state, { key, value }) {
  return { ...state, [key]: value };
}

export function RegisterPage() {
  const banner = useBanner();
  const landQuery = useFetch();
  const landMutation = useFetch();
  const submitButton = useDisableButton("Submit", "Submiting...");
  const [params] = useSearchParams();
  const landId = params.get("id") || "";

  const [state, dispatch] = useReducer(reducer, {
    street: "",
    city: "",
    postalCode: "",
    area: 0,
    certificate: null,
    photo: null,
  });

  const proposeLand = () => {
    submitButton.disable();
    const jwt = token.get();
    const data = {
      address: {
        street: state.street,
        city: state.city,
        postalCode: state.postalCode,
      },
      area: {
        value: +state.area,
        unit: "HECTARE",
      },
      certificate: state.certificate,
      photo: state.photo,
    };

    const apiCall =
      landId === ""
        ? () => landAPI.proposeLand(jwt, data)
        : () => landAPI.reviseLand(jwt, landId, data);

    landMutation.trigger(apiCall);
  };

  useEffect(() => {
    if (landId !== "") {
      landQuery.trigger(() => landAPI.getDetailLand(token.get(), landId));
    }
  }, [landQuery, landId]);

  useEffect(() => {
    if (landQuery.success) {
      const { address, area } = landQuery.data;
      dispatch({ key: "street", value: address.street });
      dispatch({ key: "city", value: address.city });
      dispatch({ key: "postalCode", value: address.postalCode });
      dispatch({ key: "area", value: area.valueInHectare });
      submitButton.update({
        enableText: "Revise",
        disabledText: "Submitting...",
      });
    }
  }, [landQuery.data, landQuery.success, submitButton]);

  useEffect(() => {
    if (landMutation.loading) {
      return;
    }
    submitButton.enable();
    if (landMutation.error.happened) {
      banner.show(landMutation.error.message);
      return;
    }
    if (landMutation.success) {
      banner.show("Land was processed successfully");
    }
  }, [
    banner,
    landMutation.error.happened,
    landMutation.error.message,
    landMutation.loading,
    landMutation.success,
    submitButton,
  ]);

  return (
    <>
      <Banner
        message={banner.message}
        onCloseClicked={banner.hide}
        visible={banner.visibility}
      />

      <ArticleContent title="Land Lending Registration" className="max-w-md">
        <div className="space-y-6 my-6">
          <Form.InputLabel
            label="Street"
            placeholder="Enter street..."
            value={state.street}
            onChange={(e) => dispatch({ key: "street", value: e.target.value })}
          />
          <Form.InputLabel
            label="City"
            placeholder="Enter city..."
            value={state.city}
            onChange={(e) => dispatch({ key: "city", value: e.target.value })}
          />
          <Form.InputLabel
            label="Postal code"
            placeholder="123xx"
            value={state.postalCode}
            onChange={(e) =>
              dispatch({ key: "postalCode", value: e.target.value })
            }
          />
          <Form.InputLabel
            label="Land area (in hectare)"
            placeholder="Enter land area..."
            value={state.area > 0 ? state.area : undefined}
            onChange={(e) =>
              dispatch({
                key: "area",
                value: e.target.value.replace(/[^0-9.]/g, ""),
              })
            }
          />

          <Form.InputFileButton
            label="Certificate"
            onChange={(e) =>
              dispatch({ key: "certificate", value: e.target.files[0] })
            }
          />
          <Form.InputFileButton
            label="Land photo"
            onChange={(e) =>
              dispatch({ key: "photo", value: e.target.files[0] })
            }
          />
        </div>
        <Button
          disabled={submitButton.status}
          text={submitButton.text}
          className="w-full"
          onClick={proposeLand}
        />
      </ArticleContent>
    </>
  );
}
