import { SnCollapse } from './script/collapse';
import { SnIcon, SnUniqueId } from './script/conmon';
import { SnInput } from './script/form';
import { SnFreeze } from './script/freeze';
import { SnMenu, SnActiveMenu } from './script/menu';
import { SnMessage } from './script/message';
import { SnModal } from './script/modal';
import { SnTab } from './script/tab';
import { SnTree } from './script/tree';
import { SnAlert } from './script/alert';

window.SnCollapse = SnCollapse;
window.SnIcon = SnIcon;
window.SnInput = SnInput;
window.SnFreeze = SnFreeze;
window.SnMenu = SnMenu;
window.SnActiveMenu = SnActiveMenu;
window.SnMessage = SnMessage;
window.SnModal = SnModal;
window.SnTab = SnTab;
window.SnTree = SnTree;
window.SnAlert = SnAlert;
window.SnUniqueId = SnUniqueId;

// Init Components
document.addEventListener("DOMContentLoaded", () => {
    SnInput();
    SnModal.init();
    SnTab.init();
    SnCollapse.init();
    SnIcon.render();
    SnAlert.init();
});