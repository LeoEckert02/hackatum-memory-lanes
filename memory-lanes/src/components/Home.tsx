import { useState, useEffect } from "react";
import { DrawerProvider } from "./ui/DrawerContext";
import Map from "./ui/map";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawerModified";
import { calculateAge } from "@/lib/utils";
import { Badge } from "./ui/badge";

function Home() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isVisited, setIsVisited] = useState(false); // State to track if location is visited

  // Check if the location is visited when selectedLocation changes
  useEffect(() => {
    if (selectedLocation?.id) {
      const visited = JSON.parse(localStorage.getItem("visited")) || [];
      setIsVisited(visited.includes(selectedLocation.id)); // Check if ID is in the list
    } else {
      setIsVisited(false);
    }
  }, [selectedLocation]);

  return (
    <div className="p-0">
      <DrawerProvider>
        <Drawer>
          <DrawerContent>
            {selectedLocation && (
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle className="text-3xl font-bold">
                    {selectedLocation.firstname},{" "}
                    {calculateAge(selectedLocation.dob)}
                  </DrawerTitle>
                  <DrawerDescription>
                    {selectedLocation.landmark}
                    {/* Show badge if location is visited */}
                    {isVisited && <Badge className="ml-2">Visited</Badge>}
                  </DrawerDescription>
                </DrawerHeader>
                <div className="my-6 px-6 py-4 mt-0">
                  <p className="text-left text-lg">
                    {selectedLocation.description}
                  </p>
                </div>
                <DrawerFooter>
                  <Button
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`,
                        "_blank"
                      )
                    }
                    className="flex items-center space-x-2"
                  >
                    <span>Open in Google Maps</span>
                  </Button>
                </DrawerFooter>
              </div>
            )}
          </DrawerContent>
        </Drawer>
        <Map setSelectedLocation={setSelectedLocation} />
      </DrawerProvider>
    </div>
  );
}

export default Home;
