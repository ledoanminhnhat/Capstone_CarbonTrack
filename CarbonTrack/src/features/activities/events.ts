/** Bắn ra sau khi log 1 activity (từ Dashboard hoặc nút ＋ trên mobile) để các danh sách tự tải lại. */
export const ACTIVITY_LOGGED_EVENT = "ct-activity-logged";

export const notifyActivityLogged = () => window.dispatchEvent(new Event(ACTIVITY_LOGGED_EVENT));
