import React, { useState } from 'react';
import { request, gql } from "graphql-request";
import AddClient from './AddClient';
import EditClient from './EditClient';
import { useQuery } from 'react-query';
import { Client } from '../interfaces/interfaces';


const Clients = () => {
  const BASE_URL = 'https://test-task.expane.pro/api/graphql';

  const [newClient, setNewClient] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    avatarUrl: '',
  });

  const [editedClient, setEdit] = useState({
    id: '',
    firstName: '',
    lastName: '',
    phone: '',
    avatarUrl: '',
  });

  const useClients = () => {
    return useQuery("getClients", async () => {
      const data = await request(BASE_URL, gql`
      query {
        getClients {
          id
          firstName
          lastName
          phone
          avatarUrl
        }
      }`)

      return data;
    });
  };
  
  const fullName = (firstName: string, lastName: string) => {
    return `${firstName} ${lastName}`;
  };

  const setClient = (id: string, firstName: string, lastName: string, phone: string, avatarUrl: string) => {
    return { id, firstName, lastName, phone, avatarUrl };
  };

  const { status, data } = useClients();

  return (
    <div className="grid grid-cols-2 gap-4 w-min">
      
        {status === 'loading'
          ? 'loading..'
          : <div className="container py-3 rounded-2xl ">
              <div className="py-4 mx-22 align-left w-4/12  rounded-md sm:px-1 lg:px-8">
              <div className="z-10  border-red-700 sm:rounded-lg">
                <table className="table-fixed rounded-2xl">
                  <thead className="bg-red-200 rounded-2xl">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-centre text-xs font-medium text-gray-500 uppercase tracking-wider">
                        phone
                      </th>
                      <th scope="col" className="px-6 py-3 text-centre text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.getClients.map((client: Client) => (
                      <tr key={client.id}>
                        <td className="px-6 py-4 whitespace-prewrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={client.avatarUrl} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {fullName(client.firstName, client.lastName)}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{client.phone}</div>
                        </td>

                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{client.id}</div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            className="inline-flex justify-center py-1 px-5 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-indigo-600  focus:outline-none transition duration-500 ease-in-out bg-blue-600 hover:bg-red-300 transform hover:scale-110" 
                            onClick={() => setEdit(setClient(client.id, client.firstName, client.lastName, client.phone, client.avatarUrl))}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }
      
      <div className="fixed left-2/3 my-7 mx-25">
        {editedClient.id !== ''
          ? <EditClient client={editedClient} setEdit={setEdit} />
          : <AddClient newClient={newClient} setNewClient={setNewClient} useClients={useClients} />
        }
      </div>
    </div>
  )
}

export default Clients;
