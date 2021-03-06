import React from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { gql, GraphQLClient} from 'graphql-request';
import { fileToDataUri } from './EditClient';
import { newClient } from '../interfaces/interfaces';

type AddClientProps = {
  newClient: newClient | any,
  setNewClient: Function,
  useClients: any,
}

const AddClient: React.FC<AddClientProps> = ({ newClient, setNewClient, useClients }) => {
  
  const { register, handleSubmit, errors } = useForm({ reValidateMode: 'onSubmit' })
  
  const onChangeFirstName = (e: any) => setNewClient({ ...newClient, firstName: e.target.value })
  const onChangeLastName = (e: any) => setNewClient({ ...newClient, lastName: e.target.value })
  const onChangePhone = (e: any) => setNewClient({ ...newClient, phone: e.target.value })
  const onChangeAvatar = (file: Blob) => {
    fileToDataUri(file)
      .then(dataUri => {
        setNewClient({ ...newClient, avatarUrl: dataUri })
      });
  };

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

    const data = await graph.request(mutation, variables);
    
    return data;
  }

  const mutation = useMutation(addClient, {
    onSuccess: () => useClients
  });

  const onSubmit = () => {
    mutation.mutate(newClient)

    setNewClient({
      firstName: '', 
      lastName: '', 
      phone: '', 
      avatarUrl: ''
    })
  };
  
  return (
    <div className=" bg-red-200 py-7 px-7 box-content rounded-xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="col-span-6 sm:col-span-3">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First name</label>
          <input 
            type="text" 
            name="firstName" 
            id="firstName"
            ref={register({
                  pattern: {
                    value: /[A-Za-z]{2}/,
                    message: "Only names with characters and length more then 2",
                  }
               })
            }  
            value={newClient.firstName} 
            onChange={onChangeFirstName} 
            autoComplete="given-name"
            required 
            className="focus:outline-none focus:ring focus:border-blue-100 px-1 font-sans font-semibold mt-1 focus:ring-indigo-300 focus:border-indigo-100 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
          {errors.firstName && <p className="text-red-800">{errors.firstName?.message}</p>}
        </div>
        <div className="col-span-6 sm:col-span-3">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last name</label>
          <input 
            type="text" 
            name="lastName" 
            id="lastName" 
            autoComplete="family-name" 
            ref={register({
                  pattern: {
                    value: /[A-Za-z]{2}/,
                    message: "Only names with characters and length more then 2",
                  }
                })
            } 
            value={newClient.lastName} 
            onChange={onChangeLastName} 
            className="focus:outline-none focus:ring px-1 font-sans font-semibold mt-1 focus:ring-indigo-300 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            required
          />
          {errors.lastName && <p className="text-red-800">{errors.lastName?.message}</p>}
        </div>
        <div className="col-span-6 sm:col-span-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
          <input 
            type="text" 
            name="phone" 
            id="phone" 
            autoComplete="phone" 
            ref={register({
                  pattern: {
                    value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
                    message: "Enter ukrainian number format",
                  }
              })
            }
            value={newClient.phone} 
            onChange={onChangePhone}
            className="focus:outline-none focus:ring px-1 font-sans font-semibold mt-1 focus:ring-indigo-300 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            required
          />
          {errors.phone && <p className="text-red-800">{errors.phone?.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cover photo
          </label>
          <div className="mt-1 flex justify-center px-6 pt-6 pb-6 border-2 border-blue-300 border-dashed rounded-md ">
            <div className="space-y-1 text-center">
              {newClient.avatarUrl === ''
                ? <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                : <span className="inline-block h-20 w-20 rounded-xl overflow-hidden bg-gray-100">
                    <img id="avatar" className="h-full w-full text-gray-300" src={newClient.avatarUrl} alt="" />
                  </span>
              }
              <div className="focus:outline-none flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-red-200 rounded-md font-medium text-indigo-600 hover:text-red-500 focus-within:outline-none transition duration-500 ease-in-out">
                  <span className="focus:outline-none ">Upload a file</span>
                  <input 
                    id="file-upload" 
                    name="avatarUrl"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e:any) => onChangeAvatar(e.target.files[0])}
                    type="file" 
                    className=" sr-only" 
                  />
                  {errors.avatarUrl && <p className="text-indigo-800">{errors.avatarUrl?.message}</p>}
                </label>
                <p className="pl-1">PNG, JPG, GIF</p>
              </div>
              <p className="text-xs text-gray-500">
                up to 10MB
              </p>
            </div>
          </div>
        </div>
        <div className=" py-3 bg-red-200 text-center sm:px-auto">
          <button type="submit" className="inline-flex justify-center py-1 px-5 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-indigo-600  focus:outline-none focus:ring-2 focus:ring-offset-2  transition duration-500 ease-in-out bg-blue-600 transform hover:scale-110">
            Add Client
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClient;
