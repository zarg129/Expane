import React, { useState} from 'react';
import { request, gql } from "graphql-request";
import AddClient from './AddClient';
import EditClient from './EditClient';
import {
  useQuery,
} from 'react-query';
import {Client} from '../interfaces/interfaces';


const Clients = () => {
  const BASE_URL = 'https://test-task.expane.pro/api/graphql';
  const [newClient, setNewClient] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    avatarUrl: '',
  })
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
    })
  }
  
  const fullName = (firstName: string, lastName: string) => {
    return `${firstName} ${lastName}`
  };

  const setClient = (id: string, firstName: string, lastName: string, phone: string, avatarUrl: string) => {
    return { id, firstName, lastName, phone, avatarUrl }
  }

  const { status, data } = useClients();

  return (
    <div className="flex justify-around">
      <div className="flex flex-col">
        {status === 'loading'
          ? 'loading..'
          : <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="table-auto">
                  <thead className="bg-gray-50">
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
                        <td className="px-6 py-4 whitespace-nowrap">
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
                          <button className="text-indigo-600 hover:text-indigo-900" onClick={() => setEdit(setClient(client.id, client.firstName, client.lastName, client.phone, client.avatarUrl))}>Edit</button>
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
      </div>
      <EditClient client={editedClient} setEdit={setEdit} />
      <AddClient newClient={newClient} setNewClient={setNewClient} useClients={useClients} />
    </div>

  )
}

export default Clients;
