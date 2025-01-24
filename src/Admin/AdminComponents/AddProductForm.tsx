import React, { useState } from 'react'
import categories from '../../Data/Categories.json'
import Input from '../../Components/UI/Input';
import { Icon } from '@iconify/react/dist/iconify.js';


interface Size {
    name: string;
    price: number;
  }
  
const AddProductForm = ({onClose}:{onClose:()=>void}) => {

    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [available, setAvailable] = useState(false);
    const [sizes, setSizes] = useState<Size[]>([{ name: '', price: 0 }]);
  
    const addSizeField = () => {
      setSizes([...sizes, { name: '', price: 0 }]);
    };
  
    const updateSize = (index: number, field: keyof Size, value: string | number) => {
      const newSizes = [...sizes];
      newSizes[index][field] = value as never;
      setSizes(newSizes);
    };
  
    const removeSizeField = (index: number) => {
      const newSizes = sizes.filter((_, i) => i !== index);
      setSizes(newSizes);
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newProduct = {
        id: Date.now(),
        name: productName,
        description,
        image,
        sizes,
        category,
        rating: 0,
        available
      };
      console.log('New Product:', newProduct);
      // Add your save logic here
    };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
    <div>
        <label className="block text-sm font-medium text-gray-700">Product Name</label>
        <Input 
            type="text" 
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
        />
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 bg-gray-100 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-300 focus:border-primary-300"
        />
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 bg-gray-100 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-300 focus:border-primary-300"
        >
            <option value="">Select Category</option>
            {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
        </select>
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <Input 
            type="text" 
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-300 focus:border-primary-300"
        />
    </div>

    <div className='flex justify-start'>
        <label className="flex items-center">
            <Input 
                type="checkbox" 
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                className="mr-2 text-primary-300 focus:ring-primary-300 "
            />
            <span>Available</span>
        </label>
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700">Sizes</label>
        {sizes.map((size, index) => (
            <div key={index} className="flex space-x-2 mb-2 items-center">
                <Input 
                    type="text" 
                    placeholder=" Name"
                    value={size.name}
                    onChange={(e) => updateSize(index, 'name', e.target.value)}
                    required
                />
                <Input 
                    type="number" 
                    placeholder="Price"
                    value={size.price}
                    onChange={(e) => updateSize(index, 'price', parseFloat(e.target.value))}
                    required
                    min="0"
                    step="0.01"
                />
                {sizes.length > 1 && (
                    <button 
                        type="button"
                        onClick={() => removeSizeField(index)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <Icon icon="fluent:delete-32-regular" />
                    </button>
                )}
            </div>
        ))}
        <button 
            type="button"
            onClick={addSizeField}
            className="mt-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
        >
            Add Size
        </button>
    </div>

    <div className="flex justify-end space-x-4 mt-6">
        <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
            Cancel
        </button>
        <button 
            type="submit"
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
        >
            Add Product
        </button>
    </div>
</form>
  )
}

export default AddProductForm
