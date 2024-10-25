export default function InputField({ label, name, width, formData, setFormData, type, disabled }) {
    const keys = name.split('.');
    function handleChange(e) {
        e.preventDefault()
        const { value } = e.target;

        setFormData((prev) => {
            const updatedState = { ...prev };

            keys.reduce((acc, key, index) => {
                if (index === keys.length - 1) {
                    acc[key] = value;
                } else {
                    acc[key] = acc[key] || {};
                }
                return acc[key];
            }, updatedState);

            return updatedState;
        });
    }

    const value = keys.length > 1
        ? formData[keys[0]] ? formData[keys[0]][keys[1]] : ''
        : formData[name] || '';


    return (<>
        <div className="mb-4">
            <label>{label}</label>
            <div className={`${label && 'mt-2'}`}>
                <input name={name}
                    disabled={disabled}
                    type={type}
                    className={`border rounded-md px-4 py-2 bg-[#424B5380] focus:outline-none ${width}`}
                    placeholder={label}
                    value={value}
                    onChange={handleChange}
                />
            </div>
        </div>
    </>)
}
