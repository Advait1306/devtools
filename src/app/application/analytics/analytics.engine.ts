import {singleton} from "tsyringe";
import mixpanel from "mixpanel-browser";

@singleton()
export default class AnalyticsEngine {

    constructor() {
        mixpanel.init('7eb7a07cfb0e454dab5aa5b4ddaa3cad', {debug: true})
    }

    public trackEvent(event: string, properties?: any) {
        mixpanel.track(event, properties);
    }

    public setUser(userId: string) {
        mixpanel.identify(userId);
    }

    public reset() {
        mixpanel.reset();
    }
}
