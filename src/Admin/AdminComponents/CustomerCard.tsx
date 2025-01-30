import { Icon } from '@iconify/react/dist/iconify.js'
import Avatar from '../../Components/Avatar'

const CustomerCard = ({customer, setDeleteDialogOpen, isPending, handleUserStatus, isupdateCustomerPending}:any) => {
  return (
     <tr key={customer.id} className="border-b w-full hover:bg-gray-50">
                    <td className="p-2 w-[10%] ">
                        <Avatar  name={customer.name} picture={customer.picture} />

                    </td>
                    <td className="p-2 w-[25%]">{customer.name}</td>
                    <td className="p-2 w-[25%]">{customer.email}</td>
    
                    <td className="p-2 w-[10%] ">
                      {customer.isVerified?
                      <img src='/Icons/check.png' className='w-6' />
                      :
                      <img src='/Icons/uncheck.png' className='w-6' />
                    }
                    </td>
                    <td className="p-2 w-[10%]">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          customer.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {customer.isActive ? "Active" : "Blocked"}
                      </span>
                    </td>
    
                   
                    <td className="p-2 w-[20%]">
                      <div className="flex items-center justify-between gap-2 max-w-[12rem]">
                        <button
                        disabled={isupdateCustomerPending}
                          onClick={() => handleUserStatus(customer._id, !customer.isActive)}
                          className={`px-3 py-1 rounded text-sm disabled:text-zinc-400 ${
                            customer.isActive
                              ? "bg-red-100 text-red-800 hover:bg-red-200"
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                          }`}
                        >
                          {customer.isActive ? "Block" : "Unblock"}
                        </button>
                        <button
                          onClick={() => setDeleteDialogOpen(customer._id)}
                          className={` ${isPending?'text-zinc-400':'text-red-600 hover:text-red-800'}`}
                        >
                          <Icon
                            icon="fluent:delete-32-regular"
                            className="text-2xl"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
  )
}

export default CustomerCard