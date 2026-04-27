import React from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SideNavigationBar from "../../shared/components/SideNavigationBar";
import Footer from "../../shared/components/Footer";
import StepIndicator from "../components/wizard/StepIndicator";
import Step1EventDetails from "../components/wizard/Step1EventDetails";
import Step2CapacityLogic from "../components/wizard/Step2CapacityLogic";
import CustomButton from "../../shared/components/CustomButton";
import useCreateEvent from "../hooks/useCreateEvent";

const STEP_CONTENT = {
  1: (props) => <Step1EventDetails {...props} />,
  2: (props) => <Step2CapacityLogic {...props} />,
};

const CreateEvent = () => {
  const { id } = useParams();
  const isEditing = !!id;

  const {
    step,
    formData,
    updateField,
    createdEvent,
    saving,
    error,
    initializing,
    goToStep1,
    goToStep2,
    saveDraft,
    publishAndFinish,
  } = useCreateEvent(id ?? null);

  const primaryAction = {
    1: { label: "Next Step", onClick: goToStep2, disabled: false },
    2: {
      label: saving
        ? isEditing
          ? "Saving..."
          : "Publishing..."
        : isEditing
          ? "Save Changes"
          : "Publish Event",
      onClick: publishAndFinish,
      disabled: saving,
    },
  }[step];

  const StepContent = STEP_CONTENT[step];

  if (initializing) {
    return (
      <div className="flex h-screen bg-MainBackground font-inter">
        <SideNavigationBar activeItem={isEditing ? "My Events" : "My Events"} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-SecondOffWhiteText text-sm">
            {isEditing ? "Loading event..." : "Setting up..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-MainBackground font-inter">
      <SideNavigationBar activeItem="My Events" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-6 pb-2 border-b border-LineBox">
          <h1 className="text-white font-jakarta font-black text-xl">
            {isEditing ? "Edit Event" : "Create Event"}
          </h1>
          <p className="text-MainOffWhiteText font-inter text-sm mt-1">
            {isEditing
              ? "Update your event details below"
              : "Fill in the details to create your event"}
          </p>
        </div>

        <StepIndicator step={step} isEditing={isEditing} />

        <main className="flex-1 overflow-y-auto p-8">
          <StepContent
            formData={formData}
            updateField={updateField}
            event={createdEvent}
          />

          {error && <p className="text-MainRed text-sm mt-6">{error}</p>}

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-LineBox">
            {/* Back */}
            <div>
              {step === 2 && (
                <CustomButton
                  title="Back"
                  icon={ArrowLeft}
                  iconPosition="LEFT"
                  onClick={goToStep1}
                  className="text-MainOffWhiteText hover:text-white text-sm"
                />
              )}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <CustomButton
                title={saving ? "Saving..." : "Save Draft"}
                onClick={saveDraft}
                disabled={saving}
                className="border border-LineBox text-white text-sm hover:bg-LineBox/50 disabled:opacity-50"
              />
              <CustomButton
                title={primaryAction.label}
                icon={step === 1 ? ArrowRight : null}
                iconPosition="RIGHT"
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
                className="w-max whitespace-nowrap bg-MainBlue hover:bg-blue-600 text-white text-sm font-semibold disabled:opacity-50 px-6 py-2"
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default CreateEvent;
