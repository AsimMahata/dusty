export const P2P_TABS = {
    SEND: "send",
    RECEIVE: "receive",
} as const;

export type P2PTabType = (typeof P2P_TABS)[keyof typeof P2P_TABS];

export const P2P_STRINGS = {
    PAGE_TITLE: "Peer-to-Peer Transfer",
    PAGE_SUBTITLE: "Fast & secure local network file sharing without internet limits.",
    SEND_TITLE: "Send Files",
    SEND_SUBTITLE: "Select files to share with nearby devices.",
    NO_FILES_SELECTED: "No files selected yet.",
    SELECT_FILES_BTN: "Select Files",
    ADD_MORE_FILES_BTN: "Add More Files",
    SEND_BTN: "SEND",
    SENDING_BTN: "Sending...",
    RECEIVE_TITLE: "Receive Files",
    RECEIVE_SUBTITLE: "Discover nearby devices sending files to you.",
    SEARCH_DEVICES_BTN: "SEARCH FOR DEVICES",
    SEARCHING_BTN: "Searching...",
    NO_DEVICES_SEARCHED: "No devices searched yet.",
    CLICK_SEARCH_HINT: 'Click "SEARCH FOR DEVICES" to scan your local network.',
    SEARCHING_FOR_SENDERS: "Searching for nearby senders...",
    DEVICES_SENDERS_TITLE: "Devices / Senders",
    TRYING_TO_SEND: "Trying to send:",
    ACCEPT_BTN: "ACCEPT",
    REJECT_BTN: "REJECT",
    NO_SENDERS_FOUND: "No senders found on network.",
    RECEIVING_FROM: "Receiving from",
    TRANSFER_IN_PROGRESS: "Transfer in progress...",
    OVERALL_PROGRESS: "Overall Progress",
    CANCEL_BTN: "CANCEL",
} as const;
