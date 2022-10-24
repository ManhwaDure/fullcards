import Editor from "@toast-ui/editor";
import { EditorPlugin } from '@toast-ui/editor/types/editor';
import { PluginInfo } from '@toast-ui/editor/types/plugin';

export default function (getEditorFunc: () => Editor): EditorPlugin {
    const popup = document.createElement('div');
    popup.className = 'modal is-active';
    popup.innerHTML = `
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">HTML 편집</p>
        <button class="delete discardBtn" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <textarea class="textarea"></textarea>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success saveBtn">저장</button>
        <button class="button discardBtn">취소</button>
      </footer>
    </div>`;
    const textarea = popup.querySelector('textarea');
    const discardButtons = Array.from(popup.querySelectorAll('.discardBtn'));
    const saveButton = popup.querySelector('.saveBtn');
    discardButtons.forEach(i => i.addEventListener('click', () => {
        document.body.removeChild(popup);
    }))
    saveButton.addEventListener('click', () => {
        getEditorFunc().setHTML(textarea.value);
        document.body.removeChild(popup);
    })

    const el = document.createElement('span');
    el.textContent = 'HTML';
    el.addEventListener('click', () => {
        textarea.value = getEditorFunc().getHTML();
        document.body.appendChild(popup);
    });
    return (): PluginInfo => ({
        toolbarItems: [
            {
                groupIndex: 4,
                itemIndex: 2,
                item: {
                    name: 'htmlRawEdit',
                    tooltip: 'HTML 직접편집',
                    el
                }
            }
        ]
    })
}