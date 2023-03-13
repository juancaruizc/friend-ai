import { FC, useState, ChangeEvent } from "react";

type FormState = {
  name: string;
  location: string;
  hobbies: string;
};

const defaultFormState: FormState = {
  name: "",
  location: "",
  hobbies: "",
};

export const Sidebar: FC = () => {
  const [formState, setFormState] = useState<FormState>(defaultFormState);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {

    localStorage.setItem("myName", formState.name);
    localStorage.setItem("myLocation", formState.location);
    localStorage.setItem("myHobbies", formState.hobbies)

    event.preventDefault();
    console.log("Form submitted with state", formState);
  };

  return (
    <div className="bg-[#F4F6F9] border-r flex py-8 justify-center h-screen">
      <form onSubmit={handleFormSubmit}>
        <label className="block">
          Name:
          <input
            className="block p-2 my-2 border-2 border-gray-600 rounded-lg"
            type="text"
            name="name"
            value={formState.name}
            onChange={handleInputChange}
          />
        </label>
        <label className="block">
          Where do you live:
          <input
            className="block p-2 my-2 border-2 border-gray-600 rounded-lg"
            name="location"
            value={formState.location}
            onChange={handleInputChange}
          />
        </label>
        <label className="block">
          Hobbies:
          <textarea
            className="block p-2 my-2 border-2 border-gray-600 rounded-lg"
            name="hobbies"
            value={formState.hobbies}
            onChange={handleInputChange}
          />
        </label>
        <button className="w-24 px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700">
          Save
        </button>
      </form>
    </div>
  );
};