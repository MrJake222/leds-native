export default class FetchHelper {
    baseUrl: string

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    async apiRequest(url: string, body: any) {
        const response = await fetch(this.baseUrl + url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        return response.json()
    }
}