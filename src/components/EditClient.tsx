import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { gql, GraphQLClient } from 'graphql-request';
import { Client } from '../interfaces/interfaces';


export const fileToDataUri = (file: Blob) => new Promise((resolve) => {
  const reader = new FileReader();
  
  reader.onload = (event: any) => {
    resolve(event.target.result)
  };
  reader.readAsDataURL(file);
});

type EditClientProp = {
  client: Client,
  setEdit: Function,
};

const EditClient: React.FC<EditClientProp> = ({ client, setEdit }) => {
  
  const {register, handleSubmit, errors} = useForm({reValidateMode: 'onSubmit'});
  
  const queryClient = useQueryClient();

  const onChangeFirstName = (e: any) => setEdit({ ...client, firstName: e.target.value });
  const onChangeLastName = (e: any) => setEdit({ ...client, lastName: e.target.value });
  const onChangePhone = (e: any) => setEdit({ ...client, phone: e.target.value });
  const onChangeAvatar = (file: Blob) => {
    fileToDataUri(file)
      .then(dataUri => {
        setEdit({ ...client, avatarUrl: dataUri })
      });
  };

  const editClient = async () => {
    const BASE_URL = 'https://test-task.expane.pro/api/graphql';
    const graph = new GraphQLClient(BASE_URL, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
    })
    const mutation = gql`
    mutation updateClientArg($id: ID!, $firstName: String!, $lastName: String!, $phone: String, $avatarUrl: String) {
      updateClient(id: $id, firstName: $firstName, lastName: $lastName, phone: $phone, avatarUrl: $avatarUrl) {
        id
        firstName
        lastName
        phone
        avatarUrl
      }
    }`

    const variables = {
      id: client.id,
      firstName: client.firstName, 
      lastName: client.lastName, 
      phone: client.phone, 
      avatarUrl: client.avatarUrl
    };

    const data = await graph.request(mutation, variables);
    
    return data;
  };

  const mutation = useMutation(editClient, {
    onMutate: async (updatedClient: Client) => {
      setEdit({
        id: '',
        firstName: '',
        lastName: '',
        phone: '',
        avatarUrl: '',
      })
      await queryClient.cancelQueries('getClients');

      const data: {getClients: Client} | any = queryClient.getQueryData('getClients')
      
      queryClient.setQueryData('getClients', (old: any) => {
        const edited = old.getClients.filter((obj: Client) => (obj.id !== updatedClient.id))
        
        edited.splice(0,0,{...updatedClient})
        
        return data
      })
      return () => queryClient.getQueryData('getClients')
    },

    onSettled: () => {
      queryClient.invalidateQueries('getClients')
    },
  });
 
  const onSubmit = () => {
    mutation.mutate(client)
  };
  
  return (
    <div className="bg-red-200 py-10 px-10 box-content rounded-xl">
      {client.id !== ''
        ? <div className="box-content md:my-8">
          <form onSubmit={handleSubmit(onSubmit) }>
            <div >
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First name</label>
              <input 
                type="text" 
                name="firstName" 
                id="first_name" 
                ref={register({
                      pattern: {
                        value: /[A-Za-z]{2}/,
                        message: "Only names with characters and length more then 2",
                    }
                  })
                } 
                onChange={onChangeFirstName} 
                value={client.firstName} 
                autoComplete="given-name" 
                className="focus:outline-none focus:ring px-1 font-sans font-semibold mt-1 focus:ring-indigo-300 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
              />
              {errors.firstName && <p className="text-red-800">{errors.firstName?.message}</p>}
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last name</label>
              <input 
                type="text" 
                name="lastName" 
                id="last_name" 
                ref={register({
                      pattern: {
                        value: /[A-Za-z]{2}/,
                        message: "Only names with characters and length more then 2",
                      }
                  })
                }  
                onChange={onChangeLastName} 
                value={client.lastName} 
                autoComplete="family-name" 
                className="focus:outline-none focus:ring px-1 font-sans font-semibold mt-1 focus:ring-indigo-300 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
              />
              {errors.lastName && <p className="text-red-800">{errors.lastName?.message}</p>}
            </div>
            <div className="col-span-6 sm:col-span-4">
              <label htmlFor="email_address" className="block text-sm font-medium text-gray-700">Phone</label>
              <input 
                type="text" 
                name="phone" 
                id="phone" 
                placeholder="+380XXXXXXXXX"
                ref={register({
                      pattern: {
                        value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
                        message: "Enter ukrainian number format",
                      }
                    })
                } 
                onChange={onChangePhone} 
                value={client.phone} 
                autoComplete="email" 
                className="focus:outline-none focus:ring px-1 font-sans font-semibold mt-1 focus:ring-indigo-300 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
              />
              {errors.phone && <p className="text-red-800">{errors.phone?.message}</p>}
            </div>
            <div className="bg-red-200">
              <label className="block text-sm font-medium text-gray-700">
                Photo
              </label>
              <div className=" mt-1 flex items-center bg-red-200">
                <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                  <img id="avatar" className="h-full w-full text-gray-300" src={client.avatarUrl} alt="" />
                </span>
                <label htmlFor="file-upload" className="mx-3 relative cursor-pointer bg-red-200 rounded-md font-medium text-indigo-600 transition duration-500 ease-in-out hover:text-red-500 focus-within:outline-none  ">
                  <span>Change Photo</span>
                  <input 
                    id="file-upload" 
                    name="avatarUrl" 
                    accept=".jpg,.jpeg,.png" 
                    type="file" 
                    onChange={(e:any) => onChangeAvatar(e.target.files[0])} 
                    className="sr-only" 
                  />
                  {errors.avatarUrl && <p className="text-indigo-800">{errors.avatarUrl?.message}</p>}
                </label>
              </div>
            </div>
            <div className="px-4 py-3 bg-red-200 text-right sm:px-6">
              <button type="submit" className="inline-flex justify-center py-1 px-5 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-indigo-600  focus:outline-none focus:ring-2 focus:ring-offset-2  transition duration-500 ease-in-out bg-blue-600 transform hover:scale-110">
                Save changes
              </button>
            </div>
          </form>
        </div>
        : 'Select Client'
      }
    </div>
  )
}

export default EditClient;