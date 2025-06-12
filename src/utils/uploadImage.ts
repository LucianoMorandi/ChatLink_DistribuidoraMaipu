export const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'tu_upload_preset') // Reemplazar
    formData.append('folder', 'chatlink') // opcional

    const response = await fetch('', {
        method: 'POST',
        body: formData,
    })

    if (!response.ok) {
        throw new Error('No se pudo subir la imagen')
    }

    const data = await response.json()
    return data.secure_url
}