import { useState, useEffect } from 'react'

import { db } from '../firebase'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import { useSession } from 'next-auth/client'
import { useDocumentOnce } from 'react-firebase-hooks/firestore'

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((module) => module.Editor),
  { ssr: false }
)

const TextEditor = () => {
  const [session] = useSession()
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const router = useRouter()
  const { id } = router.query

  const [snapshot] = useDocumentOnce(
    db.collection('userDocs').doc(session.user.email).collection('docs').doc(id)
  )

  useEffect(() => {
    if (snapshot?.data()?.editorState) {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(snapshot?.data()?.editorState)
        )
      )
    }
  }, [snapshot])

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState)

    // save on firestore
    db.collection('userDocs')
      .doc(session.user.email)
      .collection('docs')
      .doc(id)
      .set(
        { editorState: convertToRaw(editorState.getCurrentContent()) },
        { merge: true }
      )
  }

  return (
    <div>
      <div className="bg-[#f8f9fa] min-h-screen pb-16">
        <Editor
          editorState={editorState}
          toolbarClassName="flex sticky top-0 !justify-center z-50 mx-auto"
          onEditorStateChange={onEditorStateChange}
          editorClassName="mt-6 p-10 bg-white shadow-lg max-w-5xl mx-auto mb-12 border xl:mt-10"
        />
      </div>
    </div>
  )
}

export default TextEditor
