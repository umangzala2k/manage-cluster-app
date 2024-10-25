export default function SelectField({ options, name, width, formData, setFormData, disabled }) {
    function handleChange(e) {
        e.preventDefault()
        setFormData((prev) => ({
            ...prev,
            [name]: e.target.value
        }));
    }
    return (<>
        <div className="mb-4">
            <select name={name}
                disabled={disabled}
                className={`border rounded-md px-4 py-2 bg-[#424B5380] focus:outline-none ${width}`} value={formData[name]} onChange={handleChange}
            >
                {options.map((option, i) => (<option key={i} value={option}> {option} </option>))}
            </select>
        </div>
    </>)
}