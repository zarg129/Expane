import React from 'react';
import {useMutation} from 'react-query';
import { gql, GraphQLClient} from 'graphql-request';
import {fileToDataUri} from './EditClient';

const AddClient = ({newClient, setNewClient, useClients}: any) => {
  const onChangeFirstName = (e: any) => setNewClient({ ...newClient, firstName: e.target.value })
  const onChangeLastName = (e: any) => setNewClient({ ...newClient, lastName: e.target.value })
  const onChangePhone = (e: any) => setNewClient({ ...newClient, phone: e.target.value })
  const onChangeAvatar = (file: any) => {
    fileToDataUri(file)
      .then(dataUri => {
        setNewClient({ ...newClient, avatarUrl: dataUri })
      })
   
  }

  const addClient = async () => {
    const BASE_URL = 'https://test-task.expane.pro/api/graphql';
    const graph = new GraphQLClient(BASE_URL, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
    })
    const mutation = gql`
    mutation addClientNew($firstName: String!, $lastName: String!, $phone: String, $avatarUrl: String) {
      addClient(firstName: $firstName, lastName: $lastName, phone: $phone, avatarUrl: $avatarUrl) {
        id
        firstName
        lastName
        phone
        avatarUrl
      }
    }`

    const variables = {
      firstName: newClient.firstName, 
      lastName: newClient.lastName, 
      phone: newClient.phone, 
      avatarUrl: newClient.avatarUrl
    };

    const data = await graph.request(mutation, variables)
    
    return data
  }

  const mutation = useMutation(addClient, {
    onSuccess: () => useClients
  })

  const handleSubmit = (e: any) => {
    e.preventDefault();
    mutation.mutate(newClient)
    
    return setNewClient({
      firstName: '',
      lastName: '',
      phone: '',
      avatarUrl: '',
    })
  }
  
  return (
    <div className="box-content md:my-8">
      <form onSubmit={handleSubmit}>
        <div className="col-span-6 sm:col-span-3">
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First name</label>
          <input type="text" name="first_name" id="first_name" value={newClient.firstName} onChange={onChangeFirstName} autoComplete="given-name" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
        </div>
        <div className="col-span-6 sm:col-span-3">
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last name</label>
          <input type="text" name="last_name" id="last_name" autoComplete="family-name" value={newClient.lastName} onChange={onChangeLastName} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
        </div>
        <div className="col-span-6 sm:col-span-4">
          <label htmlFor="email_address" className="block text-sm font-medium text-gray-700">Phone</label>
          <input type="text" name="email_address" id="email_address" autoComplete="email" value={newClient.phone} onChange={onChangePhone}className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cover photo
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {newClient.avatarUrl === ''
                ? <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                : <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                    <img id="avatar" className="h-full w-full text-gray-300" src={newClient.avatarUrl } alt="" />
                  </span>
              }
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" onChange={(e:any) => onChangeAvatar(e.target.files[0])} type="file" className="sr-only" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Save
        </button>
      </div>
    </form>
  </div>
  )
}

export default AddClient;