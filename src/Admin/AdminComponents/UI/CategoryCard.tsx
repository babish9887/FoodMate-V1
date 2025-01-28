import Input from '../../../Components/UI/Input'
import Button from '../../../Components/UI/Button'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useState } from 'react';
import { useDeleteCategory } from '../../../Queries/category/useDeleteCategory';

const CategoryCard = ({category:c, index}:any) => {
      const [category, setCategory] = useState<any>({
        name:c.name,
        icon:c.icon
      });
    const handleImageChange=(e:any)=>{
        const files = e.target.files;
        if (files && files[0]) {
          setCategory((category:any) => ({ ...category, icon: files[0] }));
        }
    }
    console.log(category)


    const {deleteCategory}=useDeleteCategory()

    const handleDelete=(id:any)=>{
        deleteCategory(id)
    }

  return (
    <div
    key={category.id}
    className="p-4 border rounded-lg mb-4 bg-gray-50"
  >
    <div className="flex gap-4 items-start">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category Name
        </label>
        <Input
          type="text"
          value={category.name}
        onChange={(e:any)=>setCategory((c:any)=>({...c, name:e.target.value}))}
          required
        />

        <Button className="mt-4 bg-zinc-200 !text-black hover:bg-zinc-300">Edit</Button>
      </div>

      <div className="w-32">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Icon
        </label>
        <div className="relative border-2 border-dashed rounded-lg p-2 transition-colors">
          <Input
            type="file"
            // onChange={(e) => handleImageChange(index, e)}
            onChange={(e)=>handleImageChange(e)}
            id={`icon-change-${index}`}
            className="hidden"
          />
          <label
            htmlFor={`icon-change-${index}`}
            className="flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            {category.icon ? (
              <img
                src={category.icon instanceof File || category.icon instanceof FileList ?
                    URL.createObjectURL(category.icon)
                    :
                    category.icon
                }
                alt="Category icon"
                className="w-16 h-16 object-contain rounded-lg"
              />
            ) : (
              <div className="p-2 rounded-full bg-blue-50">
                <Icon
                  icon="lucide:upload"
                  className="w-8 h-8 text-blue-500"
                />
              </div>
            )}
          </label>
        </div>
      </div>

      <button
      onClick={()=>handleDelete(category.id)}
        type="button"
        // onClick={() => removeCategory(index)}
        className="text-red-500 hover:text-red-700 p-1"
      >
        <Icon icon="fluent:delete-32-regular" className="text-xl" />
      </button>
    </div>
  </div>
  )
}

export default CategoryCard