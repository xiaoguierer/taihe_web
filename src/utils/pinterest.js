export const pintrk = (...args) => {
    if (typeof window !== 'undefined') {
        window.pintrk = window.pintrk || function () {
            (window.pintrq = window.pintrq || []).push(arguments)
        }
        window.pintrk(...args)
    }
}