import { useState } from "react";

// utility hook for a toggleable trigger
export default function useTrigger(): [boolean, () => void] {
    const [trigger, setTrigger] = useState(false);

    return [trigger, () => setTrigger(!trigger)];
}
