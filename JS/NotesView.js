export default class NotesView {
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;
        this.root.innerHTML = `
            <div class="notes__sidebar col-12 col-sm-3">
                <button class="notes__add" type="button">Add Note</button>
                <div class="notes__list"></div>
            </div>
            <div class="notes__preview" col col-12 col-sm-9>

                <input class="notes__title" type="text" placeholder="Title">

                <textarea class="notes__body" id="notes__body" placeholder="Take Note...">
                </textarea>
            </div>
        `;


        const btnAddNote= this.root.querySelector(".notes__add");
        const inpTitle = this.root.querySelector(".notes__title");
        const inpBody = this.root.querySelector(".notes__body");
        
        btnAddNote.addEventListener('click',() => {
            document.getElementById("notes__body").focus();
            this.onNoteAdd();
        });

        [inpTitle,inpBody].forEach(inputField => {
            inputField.addEventListener("keyup",()=>{
                
                const updatedTitle = inpTitle.value.slice(0);
                const updatedBody = inpBody.value.slice(0);

                this.onNoteEdit(updatedTitle,updatedBody);
            });
        });

        // TODO : hide the note preview by default
        this.updateNotePreviewVisibility(false);
    }
    
    _createListItemHTML(id,title,body,updated)
    {   //side-bar preview of notes
        const MAX_BODY_LENGTH =23;
        return `
        <div class="notes__list-item" data-note-id="${id}">
            <div class="notes__small-title">${title.substring(0,21)}</div>
            <div class="notes__small-body">
            ${body.substring(0,MAX_BODY_LENGTH)}
            ${body.length> MAX_BODY_LENGTH ? "...": ''}
            </div>
            <div class="notes__small-updated">
            ${updated.toLocaleString(undefined,{dateStyle:'full', timeStyle: "short"})}
            </div>
        </div>
        `;
    }

    //update the list of nodes in the sidebar
    updateNoteList(notes){
        const notesListContainer = this.root.querySelector(".notes__list");

        //emptylist
        notesListContainer.innerHTML= "";
        
        for (const note of notes) {
            const html = this._createListItemHTML(note.id,note.title,note.body,new Date(note.updated));

            //learning require
            notesListContainer.insertAdjacentHTML("beforeend",html);
        }

        //Add select/delete events for each list item
        notesListContainer.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.addEventListener("click", () => {
                this.onNoteSelect(noteListItem.dataset.noteId);
                document.getElementById("notes__body").focus();

            });

            //delete
            noteListItem.addEventListener("dblclick", () => {
                const doDelete = confirm("Are you sure you want to delete this note?");

                if (doDelete) {
                    this.onNoteDelete(noteListItem.dataset.noteId);
                }
            });
        });


    }

    updateActiveNote(note){
        //updating the input field
        this.root.querySelector(".notes__title").value = note.title;
        this.root.querySelector(".notes__body").value = note.body;
        //if any notes is selected then after a click on other note remove highlighted...
        this.root.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.classList.remove("notes__list-item--selected");
        });
        //select note on click
        this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item--selected");
    }

    updateNotePreviewVisibility(visible) {
        this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden";
    }
}
