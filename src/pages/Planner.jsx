import React from "react";
import { useSearchParams } from "react-router-dom";
import { Airplane } from "@phosphor-icons/react";
import TripPlanner from "../components/TripPlanner";

const Planner = () => {
  const [searchParams] = useSearchParams();
  const initialDestination = searchParams.get("to") || "Jaipur";

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="label-eyebrow flex items-center gap-1.5">
          <Airplane size={14} className="text-primary" /> AI Travel Architect
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-normal mt-1 mb-2 text-white">
          Interactive Trip Planner
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Customize your destination, exact calendar dates, and travel interests. TripPilot orchestrates multi-agent itineraries with verified transport, budget estimates, and live weather advisories.
        </p>
      </div>

      {/* AI-Powered Trip Planner Component */}
      <TripPlanner initialDestination={initialDestination} />
    </div>
  );
};

export default Planner;
