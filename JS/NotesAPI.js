export default class NotesAPI{
    //get
    static getAllNotes(){
        const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");
        return notes.sort((a,b) => {
            return new Date(a.updated) > new Date(b.updated)? -1:1;
        });
    }

    //save and update existing node
    static saveNote(noteToSave){
        //get reference to all existing nodes
        const notes =NotesAPI.getAllNotes();
        const existing = notes.find(note => note.id == noteToSave.id);
        
        //Edit/update
        if(existing)
        {
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.updated = new Date().toISOString();
        }
        else
        {
            noteToSave.id = Math.floor(Math.random()*1000000);
            noteToSave.updated = new Date().toISOString();
            notes.push(noteToSave);
        }


        localStorage.setItem("notesapp-notes",JSON.stringify(notes));
    }
    
    // delete note
    static deleteNote(id)
    {
        const notes = NotesAPI.getAllNotes();
        const newNotes = notes.filter(note => note.id != id);
        
        localStorage.setItem("notesapp-notes",JSON.stringify(newNotes));
    }
}