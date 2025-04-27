#include<bits/stdc++.h>
using namespace std;
long long a[200010];
long long h[200010];
long long s[200010];
long long l[200010];
int main(){
	int q;
	cin >> q;
	while(q--){
		long long n,k;
		cin >> n >> k;
		for(int i=1;i<=n;i++){
			cin >> a[i];
			
		}
		long long ans=0;
		for(int i=1;i<=n;i++){
			cin >> h[i];
			if(h[i-1]%h[i]==0){
				if(s[i-1]+a[i]>k){
					long long S=s[i-1]+a[i];
					for(int j=i-1-l[i-1]+1;j<=i;j++){
						S-=a[j];
						if(S<=k){
							s[i]=S;
							l[i]=i-j;
							break;
						}
					}
				}else{
					s[i]=s[i-1]+a[i];
					l[i]=l[i-1]+1;
				}
			}else{
				if(a[i]<=k){
					s[i]=a[i];
					l[i]=1;
				}else{
					s[i]=0;
					l[i]=0;
				}
				
			}
			ans=max(ans,l[i]);
		}
		cout << ans << endl;
	}
	return 0;
}