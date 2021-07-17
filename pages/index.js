import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { getSession, useSession } from 'next-auth/client'
import firebase from 'firebase'
import { useCollectionOnce } from 'react-firebase-hooks/firestore'

import Header from '../components/Header'
import Login from '../components/Login'
import DocumentRow from '../components/DocumentRow'
import { db } from '../firebase'

import Button from '@material-tailwind/react/Button'
import Icon from '@material-tailwind/react/Icon'
import Modal from '@material-tailwind/react/Modal'
import ModalBody from '@material-tailwind/react/ModalBody'
import ModalFooter from '@material-tailwind/react/ModalFooter'

export default function Home() {
  const [session] = useSession()
  if (!session) return <Login />

  const [showModal, setShowModal] = useState(false)
  const [input, setInput] = useState('')

  const [snapshot] = useCollectionOnce(
    db
      .collection('userDocs')
      .doc(session?.user.email)
      .collection('docs')
      .orderBy('timestamp', 'desc')
  )

  const createDocument = () => {
    if (!input) return

    db.collection('userDocs').doc(session.user.email).collection('docs').add({
      fileName: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })

    setInput('')
    setShowModal(false)
  }

  const modal = (
    <Modal size="sm" active={showModal} toggler={() => setShowModal(false)}>
      <ModalBody>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className="w-full outline-none"
          placeholder="Enter name of document..."
          onKeyDown={(e) => e.key === 'Enter' && createDocument()}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          color="blue"
          buttonType="link"
          onClick={(e) => setShowModal(false)}
          ripple="dark"
        >
          Cancel
        </Button>
        <Button color="blue" onClick={createDocument} ripple="light">
          Create
        </Button>
      </ModalFooter>
    </Modal>
  )

  return (
    <>
      <Head>
        <title>Google Docs Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {modal}

      <section className="bg-[#f8f9fa] pb-10 px-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between py-6">
            <h2 className="text-lg text-gray-700">Start a New document</h2>
            <Button
              color="gray"
              buttonType="outline"
              iconOnly={true}
              ripple="dark"
              className="border-0"
              block={false}
            >
              <Icon name="more_vert" size="3xl" />
            </Button>
          </div>
          <div>
            <div
              className="relative w-40 transition duration-300 border-2 cursor-pointer h-52 hover:border-blue-700"
              onClick={() => setShowModal(true)}
            >
              <Image
                src="https://links.papareact.com/pju"
                alt="plus icon"
                layout="fill"
              />
            </div>
            <p className="mt-2 ml-2 font-semibold">Blank</p>
          </div>
        </div>
      </section>

      <section className="px-10 bg-white md:px-0">
        <div className="max-w-3xl py-8 mx-auto text-sm text-gray-700">
          <div className="flex items-center justify-between pb-5 ">
            <h2 className="flex-grow font-medium">My Document</h2>
            <p className="mr-12">Date Created</p>
            <Icon name="folder" size="3xl" color="gray" />
          </div>

          {snapshot?.docs.map((doc) => (
            <DocumentRow
              key={doc.id}
              id={doc.id}
              fileName={doc.data().fileName}
              date={doc.data().timestamp}
            />
          ))}
        </div>
      </section>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context)
  return {
    props: {
      session,
    },
  }
}
