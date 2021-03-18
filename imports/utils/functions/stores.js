import { writable, derived } from "svelte/store";
import { syncable } from "./localStorageStore";
import { useTracker } from 'meteor/rdb:svelte-meteor-data';

// Application state management
const INITIAL_GLOBAL_STATE = {
    mobile: false,
}

export const EMPTY_NEW_POLL = {
    dates: [],
    title: "",
    groups: [],
    times: {},
    public: false,
    allDay: false,
}
export const FAKE_POLL = {
    dates: [
        {
            date: new Date("Thu Mar 18 2021 00:00:00 GMT+0100 (heure normale d’Europe centrale)"),
            slots: ["21:45", "19:30"]
        },
        {
            date: new Date("Fri Mar 19 2021 00:00:00 GMT+0100 (heure normale d’Europe centrale)"),
            slots: ["21:45"]
        },
        {
            date: new Date("Sat Mar 20 2021 00:00:00 GMT+0100 (heure normale d’Europe centrale)"),
            slots: ["21:35", "20:30"]
        },
    ],
    title: "La réunion folle",
    description: "Une réunion qui va nous permettre de tout comprendre à la vie.",
    groups: ["kJ6h2mBsxq9JJ9WGS"],
    public: false,
    allDay: false,
    duration: "01:00",
}

export const language = syncable("language", "");
export const mobile = writable(false)
export const currentUser = useTracker(() => Meteor.user())
export const loggingIn = useTracker(() => Meteor.loggingIn())
export const newPollStore = writable(FAKE_POLL)

const store = writable(INITIAL_GLOBAL_STATE);

export const globalState = () => {
    const { subscribe, set, update } = store;

    const setState = values => {
        update(previousState => {
            const newState = {
                ...previousState,
                ...values
            }
            globalLogger(previousState, newState, values)
            return newState
        })
    };

    const reset = () => set(INITIAL_GLOBAL_STATE);

    const resetKey = key => update(p => ({
        ...p,
        [key]: INITIAL_GLOBAL_STATE[key]
    }));

    return { 
        state: store,
        subscribe,
        setState,
        reset,
        resetKey
    }
}


// loggers 
const globalLogger = (p, n, v) => {
    if (Meteor.isDevelopment) {
        if(p && n && v){
            console.groupCollapsed("Keys changed:", JSON.stringify(Object.keys(v)));
            console.log("Prev state: ", p);
            console.log("Next state: ", n);
            console.groupEnd();
        } else {
            console.groupCollapsed("Global State changed");
            console.log(p);
            console.groupEnd();
        }
    }
}

store.subscribe(globalLogger)
newPollStore.subscribe(s => {
    if (Meteor.isDevelopment) {
            console.groupCollapsed("newPollStore changed");
            console.log(s);
            console.groupEnd();
    }
})