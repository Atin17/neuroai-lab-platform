import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import DataIngestion from "./pages/DataIngestion";
import DataExplorer from "./pages/DataExplorer";
import Visualization from "./pages/Visualization";
import ModelTraining from "./pages/ModelTraining";
import ExperimentTracking from "./pages/ExperimentTracking";
import LabRegistry from "./pages/LabRegistry";
import Analytics from "./pages/Analytics";
import SignalQuality from "./pages/SignalQuality";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/data-ingestion"} component={DataIngestion} />
      <Route path={"/data-explorer"} component={DataExplorer} />
      <Route path={"/visualization"} component={Visualization} />
      <Route path={"/model-training"} component={ModelTraining} />
      <Route path={"/experiments"} component={ExperimentTracking} />
      <Route path={"/lab-registry"} component={LabRegistry} />
      <Route path={"/analytics"} component={Analytics} />
      <Route path={"/signal-quality"} component={SignalQuality} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
